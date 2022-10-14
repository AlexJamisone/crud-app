import { useState, useEffect } from 'react'
import { Box, Button, Flex, FormControl, FormLabel, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, useToast } from '@chakra-ui/react'
import api from '../services/api'
import Header from '../components/Header'

export default function Home() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [id, setId] = useState(null)
	const [clients, setClients] = useState([])
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const toast = useToast()

	useEffect(() => {
		api.get('/clients')
			.then(({data}) => setClients(data.data))
	}, [clients])

	//Validation
	const isValidForm = () => {
		if (!name) {
			return toast({
				title: "Fill in the name field",
				status: "error",
				duration: 9000,
				isClosable: true,
			})
		}
		if (!email) {
			return toast({
				title: "Fill in the email field",
				status: "error",
				duration: 9000,
				isClosable: true,
			})
		}
		if (clients.some((client) => client.email === email && client._id !== id)) {
			return toast({
				title: "Already exist with this email",
				status: "error",
				duration: 9000,
				isClosable: true,
			})
		}
	}

	// Add Client
	const handlSubmitCreateClient = async (e) => {
		e.preventDefault()

		if (isValidForm()) return;
		try {
			setIsLoading(true);
			await api.post('/clients', { name, email })

			setClients(clients.concat(data.data))
			setName('')
			setEmail('')
			setIsFormOpen(!isFormOpen)
			toast({
				title: 'Success!',
				status: "success",
				duration: 9000,
				isClosable: true
			})
			setIsLoading(false)
		} catch (error) {
			console.log(error)
			setIsLoading(false)
		}
	}
	//Delete Client
	const handlDeleteClient = async (_id) => {
		try {
			await api.delete(`/clients/${_id}`)
			toast({
				title: "Deleted Client was success!",
				status: 'info',
				duration: 5000,
				isClosable: true
			})
		} catch (error) {
			console.log(error)
			setIsLoading(false)
		}
	}

	const handleShowUpdateClient = (client) => {
		setId(client._id)
		setName(client.name)
		setEmail(client.email)
		setIsFormOpen(true)
	}	

	const handleUpdateClient = async (e) => {
		e.preventDefault()

		if (isValidForm()) return
		
		try {
			setIsLoading(true)
			await api.put(`/clients/${id}`, { name, email })
			setName('')
			setEmail('')
			setIsFormOpen(!isFormOpen)
			toast({
				title: 'Successfully edited!',
				status: "success",
				duration: 9000,
				isClosable: true
			})
			setIsLoading(false)
			
		} catch (error) {
			console.log(error)
		}

	}

	return (
		<Box>
			<Header />
			<Flex align="center" justifyContent="center">
				<Box
					width={800}
					borderWidth={1}
					borderEndRadius={8}
					boxShadow="lg"
					p={20}
					mt="25"
				>
					<Flex justifyContent='flex-end'>
						<Button colorScheme='green' onClick={() => setIsFormOpen(!isFormOpen)}>{isFormOpen ? "-" : "+"}</Button>
					</Flex>

					{isFormOpen ? (
					<VStack as="form" onSubmit={ id ? handleUpdateClient : handlSubmitCreateClient}>
						<FormControl>
							<FormLabel>Name</FormLabel>
							<Input
								type='text'
								placeholder='Name'
								value={name}
								onChange={(e) => setName(e.target.value)} />
						</FormControl>

						<FormControl>
							<FormLabel>E-mail</FormLabel>
							<Input type='email' placeholder='E-mail' value={email} onChange={(e) => setEmail(e.target.value)}/>
						</FormControl>

						<Button colorScheme="green" type="submit" mt={6} isLoading={isLoading}>
							{ id ? "Save" : "Add"}
						</Button>	
					</VStack>	
				): null}
					

					<Table variant="simple" mt={6}>
						<Thead bg="teal.500">
							<Tr>
								<Th textColor="white">Name</Th>
								<Th textColor="white">E-mail</Th>
								<Th textColor="white">Actions</Th>
							</Tr>
						</Thead>
						<Tbody>
							{
								clients.map((client, index) => (
									<Tr key={index}>
										<Td>{client.name}</Td>
										<Td>{client.email}</Td>
										<Td>
											<Flex>
												<Button size='sm' fontSize="small" colorScheme='yellow' mr='2' onClick={() => handleShowUpdateClient(client)}>Editor</Button>
												<Button size='sm' fontSize="small" colorScheme='red' mr='2' onClick={() => handlDeleteClient(client._id)}>Remove</Button>
											</Flex>
										</Td>
									</Tr>
								))
							}
							
						</Tbody>
					</Table>
				</Box>
			</Flex>
		</Box>
	)
}
